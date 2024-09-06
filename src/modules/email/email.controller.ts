import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/request/email.dto';

import { EmailCheckDto } from './dto/request/email-check.dto';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthCheck } from 'src/common/decorator/auth-check.decorator';
import { ExceptionList } from 'src/common/decorator/exception-list.decorator';

@ApiTags('Email verifiy')
@Controller('account/verify-email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * 회원가입용 이메일 보내기
   */
  @Post('/send')
  @ExceptionList([new UnauthorizedException('already have email')])
  async sendEmailSignUp(@Body() emailDto: EmailDto): Promise<NullResponseDto> {
    await this.emailService.sendVerificationEmail({
      email: emailDto.email,
      mode: 'signup',
    });
    return new NullResponseDto();
  }

  /**
   * 비밀번호 복구용 이메일 보내기
   */
  @Post('/send/recovery')
  @AuthCheck(1)
  async sendEmailRecovery(@Body() emailDto: EmailDto) {
    await this.emailService.sendVerificationEmail({
      email: emailDto.email,
      mode: 'recovery',
    });
    return new NullResponseDto();
  }

  /**
   * 이메일 체크
   */
  @Post('/check')
  @ExceptionList([new UnauthorizedException('not match verificationCode')])
  async checkEmail(@Body() emailCheckDto: EmailCheckDto) {
    await this.emailService.checkVerificationEmail(
      emailCheckDto.email,
      emailCheckDto.verificationCode,
    );
    return new NullResponseDto();
  }
}
