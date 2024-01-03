import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDetailsDto } from './dto/update-board-details.dto';
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

  async getAllBoards() {
    return await this.boardRepository.find();
  }

  async getBoardById(boardId: number) {
    const board = await this.boardRepository.findOneBy({
      id: boardId,
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  async deleteBoardById(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: {
        id: boardId,
      },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    await this.boardRepository.delete(board);
  }

  async updateBoardDetails(
    updateBoardDetailsDto: UpdateBoardDetailsDto,
    boardId: number,
  ) {
    const board = await this.boardRepository.findOneBy({
      id: boardId,
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    board.title = updateBoardDetailsDto.title;
    board.description = updateBoardDetailsDto.description;

    await this.boardRepository.save(board);
  }

  async inviteUser(boardId: number, userId: number) {
    const board = await this.boardRepository.findOne({
      where: {
        id: boardId,
      },
      relations: {
        participants: true,
      },
    });
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!board || !user) {
      throw new NotFoundException('Board or user not found');
    }

    const participation = board.participants?.find(
      (articipant) => articipant.id === userId,
    );
    if (participation) {
      throw new ConflictException('User already participate');
    }

    board.participants.push(user);
    await this.boardRepository.save(board);
  }

  async removeUser(boardId: number, userId: number) {
    const board = await this.boardRepository.findOne({
      where: {
        id: boardId,
      },
      relations: {
        participants: true,
      },
    });
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!board || !user) {
      throw new NotFoundException('Board or user not found');
    }

    const participantIndex = board.participants?.findIndex(
      (participant) => participant.id === userId,
    );
    if (participantIndex === -1) {
      throw new NotFoundException('Already removed');
    }

    board.participants.splice(participantIndex, 1);
    await this.boardRepository.save(board);
  }
}
