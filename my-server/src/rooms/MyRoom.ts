import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("move", (client, message) => {
      var char = this.state.players.get(client.sessionId)
      char.x += message.x * char.speed;
      char.y += message.y * char.speed;
    });
  
    this.onMessage("aim", (client, message) => {
      var char = this.state.players.get(client.sessionId)
      char.f_x = message.x;
      char.f_y = message.y;
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

}
