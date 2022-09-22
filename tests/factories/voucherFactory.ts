import { faker } from '@faker-js/faker';

function createVoucher() {
    return {
        code: faker.random.alphaNumeric(10),
        discount: faker.mersenne.rand(100, 1),
    };
};

function createReturnVoucherUsableFromPrisma() {
    return {
        id: faker.mersenne.rand(100, 1),
        ...createVoucher(),
        used: false
    }
}

function createReturnVoucherUnusableFromPrisma() {
    return {
        id: faker.mersenne.rand(100, 1),
        ...createVoucher(),
        used: true
    }
}

export const voucherFactory = {
    createVoucher, createReturnVoucherUsableFromPrisma, createReturnVoucherUnusableFromPrisma
};