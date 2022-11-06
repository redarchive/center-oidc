import { Controller } from '@nestjs/common'
import { PersonsService } from './persons.service'

@Controller('persons')
export class PersonsController {
  constructor (private readonly personsService: PersonsService) {}
}
