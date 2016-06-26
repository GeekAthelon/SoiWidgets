interface IFakeSoiConfig {
    name: string;
    isTest: boolean;
    env: {
        port: number;
        isDev: boolean;
    };
    db: {
        real: string;
        test: string;
        current: string;
    };
}