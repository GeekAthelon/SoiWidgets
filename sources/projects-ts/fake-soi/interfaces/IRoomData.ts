interface IRoomData {
    code: string;
    name: string;
    tail: string;
    description: string;
    owner: string;
    textLeft: string;
    textUnderChat: string;
    iconUrl: string;
    textTop: string;
    textBottom: string;
    template: string;
    body: {
        background: string;
        bgcolor: string;
        text: string;
        link: string;
        alink: string;
        vlink: string;
    };


    // Used at SOI, but not used by us
    roomAccess?: number;
    roomFormat?: number;
    quickReferenceLink?: string;
    directoryCategory?: string;
}

