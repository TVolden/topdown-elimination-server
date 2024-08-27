import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("move", (client, message) => {
      var player = this.state.players.get(client.sessionId);
      player.moveQueue = message;
    });
  
    this.onMessage("aim", (client, message) => {
      var player = this.state.players.get(client.sessionId);
      player.f_x = message.x;
      player.f_y = message.y;
    });

    this.onMessage("shoot", (client) => {
      var player = this.state.players.get(client.sessionId);
      player.shootQueue = true;
    });

    this.setSimulationInterval((deltaTime) => {
      this.update(deltaTime);
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player();
    const FLOOR_SIZE = 4;
    player.x = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
    player.y = 1.031;

    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  update(deltaTime: number) {
    var dt = deltaTime / 100;
    this.state.players.forEach(player => {
      if (player.moveQueue != null) {
        player.x += player.moveQueue.x * player.speed * dt;
        player.y += player.moveQueue.y * player.speed * dt;
        player.moveQueue = null;
      }
      if (player.shootQueue != null) {
        if (player.ammo > 0) {
          console.log("Shoot!")
          player.ammo--;
        }
        player.shootQueue = null;
      }
    });
  }
}
