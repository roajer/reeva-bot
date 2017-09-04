export class Upload {
    $key: string;
    file: File;
    imagename: string;
    imageurl: string;
    progress: number;
    createdAt: Date = new Date();

    constructor(file: File) {
        this.file = file;
    }
}
