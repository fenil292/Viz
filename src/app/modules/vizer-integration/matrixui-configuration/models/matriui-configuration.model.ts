export class MatrixUIConfiguration {
    backgroundBlinking: number;
    colorSchemaItems: ColorSchemaItems[];
}

export class ColorSchemaItems {
    id: number;
    name: string;
    background: string;
    foreground: string;
    threshold: number;
}