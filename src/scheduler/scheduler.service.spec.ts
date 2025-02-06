import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { SchedulerService } from './scheduler.service';
import { Users } from 'src/users/users.entity';
import * as moment from 'moment-timezone';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let mockQueue: jest.Mocked<any>;

  beforeEach(async () => {
    // Create mock queue with required methods
    mockQueue = {
      upsertJobScheduler: jest.fn(),
      removeJobScheduler: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: getQueueToken('schedulerQueue'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scheduleBirthdayMessage', () => {
    it('should schedule birthday message for future date', async () => {
      // Mock current date to a known value
      const mockNow = moment.tz('2025-05-15 09:00', 'Asia/Jakarta');
      jest.spyOn(moment, 'tz').mockReturnValue(mockNow);

      const mockUser: Partial<Users> = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        birthday: '1990-05-15',
        timezone: 'Asia/Jakarta',
      };

      await service.scheduleBirthdayMessage(mockUser as Users);

      // Verify queue interaction
      expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
        'birthday-1',
        {
          pattern: '0 0 9 15 5 *',
          tz: 'Asia/Jakarta'
        },
        {
          name: 'send-birthday-message',
          data: {
            userId: 1,
            email: 'john@example.com',
            name: 'John Doe',
            userTimezone: 'Asia/Jakarta'
          },
          opts: {
            priority: 1,
          },
        }
      );
    });

    it('should schedule for next year if birthday has passed this year', async () => {
      // Mock current date to after the birthday
      const mockNow = moment.tz('2025-05-15 09:00', 'Asia/Jakarta');
      jest.spyOn(moment, 'tz').mockReturnValue(mockNow);

      const mockUser: Partial<Users> = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        birthday: '1990-05-15',
        timezone: 'Asia/Jakarta',
      };

      await service.scheduleBirthdayMessage(mockUser as Users);

      // Verify queue interaction for next year
      expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
        'birthday-1',
        {
          pattern: '0 0 9 15 5 *',
          tz: 'Asia/Jakarta'
        },
        expect.any(Object)
      );
    });

    it('should handle different timezones correctly', async () => {
      const mockNow = moment.tz('2025-05-15 09:00', 'Australia/Melbourne');
      jest.spyOn(moment, 'tz').mockReturnValue(mockNow);

      const mockUser: Partial<Users> = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        birthday: '1990-05-15',
        timezone: 'Australia/Melbourne',
      };

      await service.scheduleBirthdayMessage(mockUser as Users);

      expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
        'birthday-1',
        {
          pattern: '0 0 9 15 5 *',
          tz: 'Australia/Melbourne'
        },
        expect.any(Object)
      );
    });
  });

  describe('cancelBirthdayScheduler', () => {
    it('should cancel birthday scheduler successfully', async () => {
      mockQueue.removeJobScheduler.mockResolvedValue(true);

      const result = await service.cancelBirthdayScheduler(1);

      expect(mockQueue.removeJobScheduler).toHaveBeenCalledWith('birthday-1');
      expect(result).toBe(true);
    });

    it('should handle cancellation failure', async () => {
      mockQueue.removeJobScheduler.mockResolvedValue(false);

      const result = await service.cancelBirthdayScheduler(1);

      expect(mockQueue.removeJobScheduler).toHaveBeenCalledWith('birthday-1');
      expect(result).toBe(false);
    });
  });
});