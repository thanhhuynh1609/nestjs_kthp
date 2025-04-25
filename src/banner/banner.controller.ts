import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from './banner.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findAll(): Promise<Banner[]> {
    return this.bannerService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async create(@Body() bannerData: Partial<Banner>): Promise<Banner> {
    return this.bannerService.create(bannerData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() bannerData: Partial<Banner>,
  ): Promise<Banner> {
    return this.bannerService.update(id, bannerData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.bannerService.remove(id);
  }
}