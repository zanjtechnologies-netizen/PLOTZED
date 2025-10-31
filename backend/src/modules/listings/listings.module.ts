import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { Listing } from './entities/listing.entity'
import { ListingMedia } from './entities/listing-media.entity'
import { Amenity } from './entities/amenity.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Listing, ListingMedia, Amenity])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}