import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Company, User } from '../../database/entities';
import { UserRole } from '../../database/enums';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const company = this.companiesRepository.create({
      name: dto.companyName,
      taxId: null,
      baseCurrency: 'IDR'
    });
    const savedCompany = await this.companiesRepository.save(company);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: UserRole.OWNER,
      companyId: savedCompany.id
    });
    const savedUser = await this.usersRepository.save(user);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        companyId: savedUser.companyId
      }),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role
      },
      company: {
        id: savedCompany.id,
        name: savedCompany.name,
        baseCurrency: savedCompany.baseCurrency
      }
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      })
    };
  }
}
