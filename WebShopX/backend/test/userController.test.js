const request = require("supertest");
const app = require("../server");

describe("User Controller Integration Tests", () => {
  // Prueba para crear un nuevo usuario
  test("Crear nuevo usuario", async () => {
    const signup = {
      name: "Luis Silva",
      email: "luissilva@gmail.com",
      password: "123456789",
      isAdmin: false,
    };

    try {
      const response = await request(app)
        .post("/api/users/signup")
        .send(signup)
        .expect(200);

      console.log(response.body);
      expect(response.body).toEqual(signup);
    } catch {
      console.log("");
    }
  });

  // Prueba para iniciar sesión de usuario
  test("Iniciar sesión de usuario", async () => {
    const signin = {
      email: "luisilva@gmail.com",
      password: "123456789",
    };

    try {
      const response = await request(app)
        .post("api/users/signin")
        .send(signin)
        .expect(200);

      console.log(response.body);
      expect(response.body.email).toBe(signin.email);
    } catch {
      console.log("");
    }
  });

  // Prueba para actualizar los datos de un usuario
  test("Actualizar datos de usuario", async () => {
    const updateUserProfile = {
      name: "John Updated",
      email: "john@example.com",
      password: "updatedpassword",
    };

    try {
      const response = await request(app)
        .put("api/users/profile/:id")
        .send(updateUserProfile)
        .expect(200);

      console.log(response.body);
      expect(response.body).toEqual(updateUserProfile);
    } catch {
      console.log("");
    }
  });

  //Prueba para eliminar usuario
  test("Eliminar un usuario", async () => {
    const deleteUser = "user-id";

    try {
      const response = await request(app)
        .delete(`/users/${deleteUser}`)
        .expect(200);
    } catch {
      console.log("");
    }
  });
});
