import { ConsoleLogger } from '@nestjs/common'
import moment from 'moment'

export class MyLogger extends ConsoleLogger {
  protected getTimestamp(): string {
    return moment().utcOffset(7).toISOString(true)
  }
}
