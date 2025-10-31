import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadsRepository.create({
      ...createLeadDto,
      listing: createLeadDto.listingId ? ({ id: createLeadDto.listingId } as any) : null,
    });

    return await this.leadsRepository.save(lead);
  }

  async findAll(filterDto: FilterLeadDto): Promise<{ data: Lead[]; total: number; page: number; totalPages: number }> {
    const { search, status, priority, assignedTo, listingId, page = 1, limit = 10, sortBy, sortOrder } = filterDto;

    const queryBuilder = this.leadsRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.listing', 'listing')
      .leftJoinAndSelect('lead.assigned_to', 'assigned_to');

    if (search) {
      queryBuilder.andWhere(
        '(lead.name ILIKE :search OR lead.email ILIKE :search OR lead.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('lead.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('lead.priority = :priority', { priority });
    }

    if (assignedTo) {
      queryBuilder.andWhere('lead.assigned_to = :assignedTo', { assignedTo });
    }

    if (listingId) {
      queryBuilder.andWhere('lead.listing = :listingId', { listingId });
    }

    queryBuilder.orderBy(`lead.${sortBy}`, sortOrder);

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

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: ['listing', 'assigned_to'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    if (updateLeadDto.status === LeadStatus.CONTACTED) {
      lead.last_contacted_at = new Date();
    }

    if (updateLeadDto.assignedToId) {
      lead.assigned_to = { id: updateLeadDto.assignedToId } as any;
      delete (updateLeadDto as any).assignedToId;
    }

    Object.assign(lead, updateLeadDto);

    return await this.leadsRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadsRepository.remove(lead);
  }

  async assignToAgent(leadId: string, agentId: string): Promise<Lead> {
    const lead = await this.findOne(leadId);
    lead.assigned_to = { id: agentId } as any;
    return await this.leadsRepository.save(lead);
  }

  async getLeadStatistics() {
    const totalLeads = await this.leadsRepository.count();
    const newLeads = await this.leadsRepository.count({ where: { status: LeadStatus.NEW } });
    const convertedLeads = await this.leadsRepository.count({ where: { status: LeadStatus.CONVERTED } });
    
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      newLeads,
      convertedLeads,
      conversionRate: conversionRate.toFixed(2),
    };
  }
}
