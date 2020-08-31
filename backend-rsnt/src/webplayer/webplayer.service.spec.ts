import { Test, TestingModule } from '@nestjs/testing';
import { WebplayerService } from './webplayer.service';

describe('WebplayerService', () => {
  let service: WebplayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebplayerService],
    }).compile();

    service = module.get<WebplayerService>(WebplayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
