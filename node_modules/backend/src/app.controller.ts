import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { get } from 'http';
import { connected } from 'process';
import { timestamp } from 'rxjs';
@Controller()
export class AppController {
  constructor(private dataSource: DataSource) {}

  @Get()
  getHello(): string {
    return 'Hello world!';
  }

  @Get('db-test')
  async testDb(){
    try{
      const result = await this.dataSource.query('SELECT NOW()');
      return{connected:true, timestamp:result[0].now};
    }catch(error){
      console.error('Database connection error:',error);
      return{connected:false, error:error.message};

    }
    
    }
  }

