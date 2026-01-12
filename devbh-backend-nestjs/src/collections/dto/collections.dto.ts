import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateCollectionDto {
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

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    cover_image?: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    display_order?: number;
}

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) { }
