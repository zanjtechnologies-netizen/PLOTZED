import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, Between, In } from 'typeorm'
import { Listing, ListingStatus } from './entities/listing.entity'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FilterListingDto } from './dto/filter-listing.dto'
import { NearbySearchDto } from './dto/nearby-search.dto'

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async create(createListingDto: CreateListingDto, userId: string): Promise<Listing> {
    // Generate slug from title
    const slug = this.generateSlug(createListingDto.title)

    // Check if slug already exists
    const existingListing = await this.listingsRepository.findOne({ where: { slug } })
    if (existingListing) {
      throw new BadRequestException('A listing with similar title already exists')
    }

    // Calculate price per sqft
    const pricePerSqft = createListingDto.price / createListingDto.area

    const listing = this.listingsRepository.create({
      ...createListingDto,
      slug,
      pricePerSqft,
      createdBy: { id: userId } as any,
      publishedAt: createListingDto.isPublished ? new Date() : undefined,
    })

    return await this.listingsRepository.save(listing)
  }

  async findAll(filterDto: FilterListingDto): Promise<{ data: Listing[]; total: number; page: number; totalPages: number }> {
    const { search, type, status, city, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, isFeatured, amenities, page = 1, limit = 10, sortBy, sortOrder } = filterDto

    const queryBuilder = this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.media', 'media')
      .leftJoinAndSelect('listing.amenities', 'amenities')
      .leftJoinAndSelect('listing.assignedAgent', 'agent')

    // Apply filters
    if (search) {
      queryBuilder.andWhere('(listing.title ILIKE :search OR listing.description ILIKE :search OR listing.address ILIKE :search)', {
        search: `%${search}%`,
      })
    }

    if (type) {
      queryBuilder.andWhere('listing.type = :type', { type })
    }

    if (status) {
      queryBuilder.andWhere('listing.status = :status', { status })
    }

    if (city) {
      queryBuilder.andWhere('listing.city ILIKE :city', { city: `%${city}%` })
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('listing.price >= :minPrice', { minPrice })
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('listing.price <= :maxPrice', { maxPrice })
    }

    if (minArea !== undefined) {
      queryBuilder.andWhere('listing.area >= :minArea', { minArea })
    }

    if (maxArea !== undefined) {
      queryBuilder.andWhere('listing.area <= :maxArea', { maxArea })
    }

    if (bedrooms !== undefined) {
      queryBuilder.andWhere('listing.bedrooms = :bedrooms', { bedrooms })
    }

    if (bathrooms !== undefined) {
      queryBuilder.andWhere('listing.bathrooms = :bathrooms', { bathrooms })
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('listing.isFeatured = :isFeatured', { isFeatured })
    }

    if (amenities && amenities.length > 0) {
      queryBuilder.andWhere('amenities.id IN (:...amenities)', { amenities })
    }

    // Only show published listings for public
    queryBuilder.andWhere('listing.isPublished = :isPublished', { isPublished: true })

    // Sorting
    queryBuilder.orderBy(`listing.${sortBy}`, sortOrder)

    // Pagination
    const skip = (page - 1) * limit
    queryBuilder.skip(skip).take(limit)

    const [data, total] = await queryBuilder.getManyAndCount()

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['media', 'amenities', 'createdBy', 'assignedAgent'],
    })

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`)
    }

    return listing
  }

  async findBySlug(slug: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { slug },
      relations: ['media', 'amenities', 'createdBy', 'assignedAgent'],
    })

    if (!listing) {
      throw new NotFoundException(`Listing with slug ${slug} not found`)
    }

    return listing
  }

  async findNearby(nearbyDto: NearbySearchDto): Promise<Listing[]> {
    const { latitude, longitude, radius, limit } = nearbyDto

    const queryBuilder = this.listingsRepository.createQueryBuilder('listing')

    // Using Haversine formula for distance calculation
    queryBuilder
      .addSelect(
        `
        (6371 * acos(cos(radians(:latitude)) * cos(radians(listing.latitude)) * 
        cos(radians(listing.longitude) - radians(:longitude)) + 
        sin(radians(:latitude)) * sin(radians(listing.latitude))))
      `,
        'distance',
      )
      .where('listing.latitude IS NOT NULL AND listing.longitude IS NOT NULL')
      .having('distance < :radius')
      .orderBy('distance', 'ASC')
      .setParameters({ latitude, longitude, radius })
      .take(limit)

    return await queryBuilder.getMany()
  }

  async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.findOne(id)

    // Update slug if title changed
    if (updateListingDto.title && updateListingDto.title !== listing.title) {
      updateListingDto['slug'] = this.generateSlug(updateListingDto.title)
    }

    // Recalculate price per sqft if price or area changed
    if (updateListingDto.price || updateListingDto.area) {
      const price = updateListingDto.price || listing.price
      const area = updateListingDto.area || listing.area
      updateListingDto['pricePerSqft'] = price / area
    }

    Object.assign(listing, updateListingDto)

    return await this.listingsRepository.save(listing)
  }

  async remove(id: string): Promise<void> {
    const listing = await this.findOne(id)
    await this.listingsRepository.remove(listing)
  }

  async getFeaturedListings(limit: number = 6): Promise<Listing[]> {
    return await this.listingsRepository.find({
      where: { isFeatured: true, isPublished: true },
      relations: ['media'],
      take: limit,
      order: { createdAt: 'DESC' },
    })
  }

  async getSimilarListings(listingId: string, limit: number = 4): Promise<Listing[]> {
    const listing = await this.findOne(listingId)

    return await this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.media', 'media')
      .where('listing.id != :id', { id: listingId })
      .andWhere('listing.type = :type', { type: listing.type })
      .andWhere('listing.city = :city', { city: listing.city })
      .andWhere('listing.isPublished = :isPublished', { isPublished: true })
      .orderBy('ABS(listing.price - :price)', 'ASC')
      .setParameter('price', listing.price)
      .take(limit)
      .getMany()
  }

  async getStatistics() {
    const totalListings = await this.listingsRepository.count()
    const availableListings = await this.listingsRepository.count({ where: { status: ListingStatus.AVAILABLE } })
    const soldListings = await this.listingsRepository.count({ where: { status: ListingStatus.SOLD } })

    const avgPriceResult = await this.listingsRepository
      .createQueryBuilder('listing')
      .select('AVG(listing.price)', 'avgPrice')
      .getRawOne()

    return {
      totalListings,
      availableListings,
      soldListings,
      averagePrice: avgPriceResult?.avgPrice || 0,
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()
  }
}
