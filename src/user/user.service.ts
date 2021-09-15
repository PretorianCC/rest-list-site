import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor (@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  /**
   * Создать пользователя.
   * @param dto модель авторизации.
   * @returns созданный пользователь.
   */
   async createUser(dto: UserDto): Promise<User> {
    const newUser = new User();
    newUser.email = dto.email;
    newUser.name = dto.name;
    return this.userRepository.save(newUser)
   }

  /**
   * Найти пользователя.
   * @param email почтовый адрес пользователя.
   * @returns найденый пользователь.
   */
  async findUser(email: string): Promise<User> {
    return this.userRepository.findOne({email});
  }

}
