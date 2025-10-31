import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FilterListingDto } from './dto/filter-listing.dto'
import { NearbySearchDto } from './dto/nearby-search.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/role.enum'

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Agent)
  create(@Body() createListingDto: CreateListingDto, @Request() req) {
    return this.listingsService.create(createListingDto, req.user.id)
  }

  @Get()
  findAll(@Query() filterDto: FilterListingDto) {
    return this.listingsService.findAll(filterDto)
  }

  @Get('featured')
  getFeatured(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    return this.listingsService.getFeaturedListings(limit)
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getStatistics() {
    return this.listingsService.getStatistics()
  }

  @Post('nearby')
  findNearby(@Body() nearbyDto: NearbySearchDto) {
    return this.listingsService.findNearby(nearbyDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.listingsService.findOne(id)
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.listingsService.findBySlug(slug)
  }

  @Get(':id/similar')
  findSimilar(@Param('id', ParseUUIDPipe) id: string, @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number) {
    return this.listingsService.getSimilarListings(id, limit)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Agent)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(id, updateListingDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.listingsService.remove(id)
  }
}
