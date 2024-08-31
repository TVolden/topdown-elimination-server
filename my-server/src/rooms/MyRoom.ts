import { Room, Client } from "@colyseus/core";
import { Bullet, MyRoomState, Player } from "./schema/MyRoomState";

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
      
      if (player.fireCooldown == 0) {
        if (player.shootQueue != null && player.ammo > 0) {
          var bullet = new Bullet();
          bullet.x = player.x;
          bullet.y = player.y;
          bullet.dir_x = player.f_x - player.x;
          bullet.dir_y = player.f_y - player.y;
          var length = Math.sqrt(Math.pow(bullet.dir_x,2) + Math.pow(bullet.dir_y,2))
          bullet.dir_x = bullet.dir_x / length;
          bullet.dir_y = bullet.dir_y / length;
          var id = crypto.randomUUID();
          this.state.bullets.set(id, bullet)
          console.log("Bullet added: \t\t", id)
          player.fireCooldown = 10;
          player.ammo--;
        }
      } else {
        player.fireCooldown = Math.max(player.fireCooldown - dt, 0);
      }
      player.shootQueue = null;
    });

    this.state.bullets.forEach((bullet, key) => {
      var org_x = bullet.x;
      var org_y = bullet.y;
      bullet.x += bullet.dir_x * bullet.speed * dt;
      bullet.y += bullet.dir_y * bullet.speed * dt;
      bullet.range_left = Math.max(0, bullet.range_left-Math.sqrt(Math.pow(org_x - bullet.x, 2) + Math.pow(org_y - bullet.y, 2)));

      if (bullet.range_left == 0) {
        console.log("Bullet removed: \t", key)
        this.state.bullets.delete(key);
      }
    });
  }
}
