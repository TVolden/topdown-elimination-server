import { Room, Client } from "@colyseus/core";
import { PlaygroundState } from "./schema/PlaygroundState";
import { Boomer } from "./schema/Boomer";

export class Playground extends Room<PlaygroundState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new PlaygroundState());

    this.onMessage("move", (client, message) => {
      var player = this.state.players.get(client.sessionId);
      if (player.transfer == 1)
        player.moveQueue = message;
    });

    this.setSimulationInterval((deltaTime) => {
      var dt_sec = deltaTime / 100;
      this.update(dt_sec);
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const player = new Boomer();
    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  update(deltaTime:number) {
    this.state.players.forEach(player => {
      player.update(deltaTime);
    });

    this.state.bombs.forEach((bomb, uuid) => {
      bomb.update(deltaTime);
      
      if (bomb.exploded) {
        this.broadcast("exploded", bomb);
        this.state.bombs.delete(uuid);
      }
    });
  }
}
