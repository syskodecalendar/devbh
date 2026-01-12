import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, isString, IsString, IsUrl, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJewelryMediaDto {
    @ApiProperty({ enum: ['image', 'video'] })
    @IsEnum(['image', 'video'])
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    color_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    color_code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    is_cover?: boolean;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    display_order?: number;
}

export class CreateJewelrySetDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    collection_id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    short_description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    base_price?: number;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    has_diamond?: boolean;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    display_order?: number;

    @ApiProperty({ type: [CreateJewelryMediaDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateJewelryMediaDto)
    media: CreateJewelryMediaDto[];
}

export class UpdateJewelrySetDto extends PartialType(CreateJewelrySetDto) { }
