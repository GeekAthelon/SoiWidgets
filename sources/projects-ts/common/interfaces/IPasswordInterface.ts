interface IPasswordInterface {
    genSalt(): Promise<string>;
    hash(salt: string, password: string): Promise<string>;
    compare(salt: string, password: string, hash: string): Promise<boolean>;
}
