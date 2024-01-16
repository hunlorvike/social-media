import { Get, Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/configs/decorator/roles.decorator';
import { RolesGuard } from 'src/configs/guards/roles.guard';

@Controller('test')
@ApiTags('Test')
export class TestController {

    @Get('user')
    @UseGuards(RolesGuard)
    @Roles('user')
    userRoute() {
        return { message: 'This route is for users only!' };
    }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles('admin')
    adminRoute() {
        return { message: 'This route is for admins only!' };
    }

    @Get('manager')
    @UseGuards(RolesGuard)
    @Roles('manager')
    managerRoute() {
        return { message: 'This route is for managers only!' };
    }
}
