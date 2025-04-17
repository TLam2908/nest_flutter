import { IsNotEmpty, IsString } from "class-validator";

export class CreateTodoDto {
    @IsNotEmpty()
    title: string;
}
