import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './banner.schema';

@Injectable()
export class BannerService {
  constructor(@InjectModel('Banner') private bannerModel: Model<Banner>) {}

  async create(bannerData: Partial<Banner>): Promise<Banner> {
    const banner = new this.bannerModel(bannerData);
    return banner.save();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().exec();
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
    }
    return banner;
  }

  async update(id: string, bannerData: Partial<Banner>): Promise<Banner> {
    const banner = await this.findOne(id);
    Object.assign(banner, bannerData);
    return banner.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bannerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
    }
  }
}
