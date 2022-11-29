import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ShippingEntity} from "./shipping.entity";
import {Repository} from "typeorm";
import {UserService} from "../users/user.service";
import {JwtService} from "@nestjs/jwt";
import { CreateShippingDTO } from "./shipping.dto";
import { OderService } from "../oder/oder.service";


@Injectable()
export class ShippingService {
    constructor(@InjectRepository(ShippingEntity) 
        private readonly shippingRepository: Repository<ShippingEntity>,
                private readonly userService: UserService,
                private readonly oderService: OderService,
                private readonly jwtService : JwtService

    ) {}
   
    async getAll():Promise<ShippingEntity[]>{
        try{
            const result = await this.shippingRepository.find({
                relations:{ oderEntity: true}
            });
            return result;
        }catch(err){
            throw err;
        }
    }
    async create(data: CreateShippingDTO, token: any): Promise<ShippingEntity>{
        const oder = await this.oderService.getByOderId(data.oder_id);
            
        if(!oder){
               throw console.log("Can't found user or oder");
            }   
        
        if(token.authorization){
                const _token = token.authorization.split(" ");
                const payload = this.jwtService.verify(_token[1]);

                const user = await this.userService.getById(payload.user_id);

                const shippingEntity = new ShippingEntity();
                shippingEntity.name= user.name;
                shippingEntity.phone= user.phone;
                shippingEntity.oderEntity = oder;


                const result = await this.shippingRepository.save(shippingEntity);
                return result;
            }else{
                if(data.name || data.phone){
                    const shippingEntity = new ShippingEntity();
                    shippingEntity.name= data.name;
                    shippingEntity.phone= data.phone;
                    shippingEntity.oderEntity = oder;

                    const result = await this.shippingRepository.save(shippingEntity);
                    return result;
    
                }else{
                    throw console.log("failed");
                }
                
            };
    }
    
}