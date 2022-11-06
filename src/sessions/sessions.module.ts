import { Module } from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { SessionsController } from './sessions.controller'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [SessionsController],
  providers: [SessionsService]
})
export class SessionsModule {}
