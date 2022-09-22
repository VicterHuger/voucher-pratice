import voucherService from '../../src/services/voucherService';
import voucherRepository from '../../src/repositories/voucherRepository';
import { voucherFactory } from '../factories/voucherFactory';
import { conflictError } from '../../src/utils/errorUtils';

describe('Test createVoucher function in voucher service', () => {
    it('should return error conflict status if the voucher passed already exist', async () => {

        const voucherCreated = voucherFactory.createReturnVoucherUsableFromPrisma();

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(voucherCreated);

        try {
            await voucherService.createVoucher(voucherCreated.code, voucherCreated.discount);
        } catch (err) {
            expect(err).toEqual(conflictError('Voucher already exist.'));
        }

    });

    it('should return void response if a voucher to be created is correct', async () => {
        const { code, discount } = voucherFactory.createVoucher();

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(null);

        const result = await voucherService.createVoucher(code, discount);

        expect(result).toBeFalsy();
    })

});

describe('Test applyVoucher function on voucherService.ts file', () => {
    it('should return error conflict message if the voucher does not  exist', async () => {
        const amount = 10;
        const voucherCreated = voucherFactory.createVoucher();

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(null);

        try {
            await voucherService.applyVoucher(voucherCreated.code, amount);
        } catch (err) {
            expect(err).toEqual(conflictError('Voucher does not exist.'));
        }

    });


    it('should return an object for a voucher that was not applied because the min amount is bigger than the amount passed', async () => {

        const amount = 50;
        const voucher = voucherFactory.createReturnVoucherUsableFromPrisma();

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(voucher);

        const result = await voucherService.applyVoucher(voucher.code, amount);

        expect(result).toEqual({
            amount,
            discount: voucher.discount,
            finalAmount: amount,
            applied: false
        });

    });

    it('should return an object for a voucher that was not applied because the voucher was already used and the amount is bigger than the min value amount', async () => {
        const amount = 150;
        const voucher = voucherFactory.createReturnVoucherUnusableFromPrisma();

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(voucher);

        const result = await voucherService.applyVoucher(voucher.code, amount);

        expect(result).toEqual({
            amount,
            discount: voucher.discount,
            finalAmount: amount,
            applied: false
        });
    });

    it('should return an object for a voucher that was applied', async () => {
        const amount = 150;
        const voucher = voucherFactory.createReturnVoucherUsableFromPrisma();

        jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(voucher);
        jest.spyOn(voucherRepository, 'useVoucher').mockResolvedValue({ ...voucher, used: true });

        const result = await voucherService.applyVoucher(voucher.code, amount);

        expect(result).toEqual({
            amount,
            discount: voucher.discount,
            finalAmount: amount - amount * (voucher.discount / 100),
            applied: true
        });

    });




})