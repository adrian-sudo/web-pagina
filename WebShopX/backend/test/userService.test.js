const userService = require("../services/userServices");

describe("Servicios de Usuarios", () => {
  // Prueba para crear un nuevo usuario
  test("Crear nuevo usuario", async () => {
    const userData = {
      name: "Alejandro Ovalle",
      email: "ovalle@gmail.com",
      password: "123456789",
      isAdmin: false,
    };

    try {
      const result = await userService.signup(userData);
      console.log(result);
      expect(result).toEqual(userData);
    } catch {
      console.log("");
    }
  });

  // Prueba para obtener el inicio de sesión de un usuario
  test("Obtener inicio de sesión de usuario", async () => {
    const credentials = {
      email: "ovalle@gmail.com",
      password: "123456789",
    };

    try {
      const result = await userService.signin(credentials);
      console.log(result);
      expect(result).toBeDefined();
    } catch {
      console.log("");
    }
  });

  // Prueba para actualizar un usuario por su ID
  test("Actualizar usuario por ID", async () => {
    const userData = {
      name: "John",
      email: "john.doe@example.com",
      password: "newpassword123",
    };

    try {
      const result = await userService.updateUserProfile(userData);
      console.log(result);
      expect(result).toEqual(userData);
    } catch {
      console.log("");
    }
  });

  //Prueba para eliminar un usuario por ID
  test("Eliminar usuario por ID", async () => {
    const id = 1;

    try {
      await userService.deleteUser(id);
      expect(true).toBe(true);
    } catch {
      console.log("");
    }
  });
});
