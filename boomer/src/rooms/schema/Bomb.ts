import { Schema, type } from "@colyseus/schema";

export class Bomb extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") range: number = 1;
    timeleft: number = 5;
    exploded: boolean = false;
  
    update(deltaTime: number) {
        if ( !this.exploded ) {
            this.timeleft = Math.max(0, this.timeleft - deltaTime);
            if (this.timeleft == 0)
                this.exploded = true;
        }
    }
}
  