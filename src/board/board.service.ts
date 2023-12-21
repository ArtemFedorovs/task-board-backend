import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createBoardDto: CreateBoardDto, ownerId: number) {
    const owner = await this.userRepository.findOneBy({
      id: ownerId,
    });
    const newBoard = this.boardRepository.create({
      title: createBoardDto.title,
      description: createBoardDto.description,
      owner: owner,
    });
    return await this.boardRepository.save(newBoard);
  }
  // create(createBoardDto: CreateBoardDto) {
  //   return 'This action adds a new board';
  // }

  // findAll() {
  //   return `This action returns all board`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} board`;
  // }

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //   return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
