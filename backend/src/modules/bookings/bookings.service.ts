import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check if time slot is available
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        listing: { id: createBookingDto.listingId },
        booking_date: new Date(createBookingDto.booking_date),
        booking_time: createBookingDto.booking_time,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('This time slot is already booked');
    }

    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      listing: { id: createBookingDto.listingId } as any,
      lead: createBookingDto.leadId ? ({ id: createBookingDto.leadId } as any) : null,
      user: createBookingDto.userId ? ({ id: createBookingDto.userId } as any) : null,
    });

    return await this.bookingsRepository.save(booking);
  }

  async findAll(
    filterDto: FilterBookingDto
  ): Promise<{ data: Booking[]; total: number; page: number; totalPages: number }> {
    const { status, booking_type, listingId, userId, startDate, endDate, page = 1, limit = 10, sortBy, sortOrder } = filterDto;

    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.listing', 'listing')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.lead', 'lead');

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (booking_type) {
      queryBuilder.andWhere('booking.booking_type = :booking_type', { booking_type });
    }

    if (listingId) {
      queryBuilder.andWhere('booking.listing = :listingId', { listingId });
    }

    if (userId) {
      queryBuilder.andWhere('booking.user = :userId', { userId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('booking.booking_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder.orderBy(`booking.${sortBy}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['listing', 'user', 'lead'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    if (updateBookingDto.status === BookingStatus.CANCELLED) {
      booking.cancelled_at = new Date();
    }

    Object.assign(booking, updateBookingDto);

    return await this.bookingsRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CONFIRMED;
    return await this.bookingsRepository.save(booking);
  }

  async cancelBooking(id: string, reason: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    booking.cancellation_reason = reason;
    booking.cancelled_at = new Date();
    return await this.bookingsRepository.save(booking);
  }

  async getAvailableSlots(listingId: string, date: string): Promise<string[]> {
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const bookedSlots = await this.bookingsRepository.find({
      where: {
        listing: { id: listingId },
        booking_date: new Date(date),
        status: BookingStatus.CONFIRMED,
      },
      select: ['booking_time'],
    });

    const bookedTimes = bookedSlots.map(b => b.booking_time);
    return allSlots.filter(slot => !bookedTimes.includes(slot));
  }

  async getBookingStatistics() {
    const totalBookings = await this.bookingsRepository.count();
    const pendingBookings = await this.bookingsRepository.count({
      where: { status: BookingStatus.PENDING },
    });
    const completedBookings = await this.bookingsRepository.count({
      where: { status: BookingStatus.COMPLETED },
    });
    const cancelledBookings = await this.bookingsRepository.count({
      where: { status: BookingStatus.CANCELLED },
    });

    return {
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
    };
  }
}
