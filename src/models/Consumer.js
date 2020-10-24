import { Schema } from 'mongoose';
import Joi from 'joi';
import { User, userRules } from './User';
import { Address, addressRules } from './Address';

const ConsumerSchema = new Schema({
    address: {
        type: Address,
        required: true
    },
});

const Consumer = User.discriminator('Consumer', ConsumerSchema);

const consumerRules = userRules.concat(Joi.object({
    role: Joi.string().valid('Consumer'),
    address: addressRules.required()
}));

export { Consumer, consumerRules };
