export class Carta {
    Nombre: string;
    imagenDelante: string;
    imagenDetras: string;
    id: number;
    familiaId: number;
    relacion: any;
  
    constructor(nombre?: string, imagenDelante?: string, imagenDetras?: string , familiaId?: number , id?: number , relacion?: any
      ) {
  
      this.Nombre = nombre;
      this.imagenDelante = imagenDelante;
      this.imagenDetras = imagenDetras;
      this.familiaId=familiaId;
      this.id=id;
      this.relacion=relacion;
    }
  }
  