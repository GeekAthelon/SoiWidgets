interface IFakeSoiConfig {
    name: string;
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