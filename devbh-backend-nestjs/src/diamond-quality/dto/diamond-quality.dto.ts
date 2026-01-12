import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateDiamondQualityDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, default: 1.00 })
    @IsOptional()
    @IsNumber()
    price_multiplier?: number;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    display_order?: number;
}

export class UpdateDiamondQualityDto extends PartialType(CreateDiamondQualityDto) { }
