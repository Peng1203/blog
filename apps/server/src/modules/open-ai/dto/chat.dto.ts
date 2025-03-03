import { Type } from '@nestjs/class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, ValidateNested } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

class MessageItem {
  @IsString()
  role: string

  @IsString()
  content: string
}

export class ChatDto {
  @IsArray()
  @Type(() => MessageItem)
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @ApiProperty({ description: '聊天内容数组' })
  messages: MessageItem[]
}
