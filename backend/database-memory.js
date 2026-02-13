import { randomUUID } from "node:crypto";

export class DatabaseMemory {
    #cadastro = new Map();

    list(search) {
        return Array.from(this.#cadastro.entries())
        .map((cadArray) => {
            const id = cadArray[0];
            const data = cadArray[1];

            return {
                id,
                ...data,
            }
        })
        .filter(cadastro => {
            if (search) {
                return this.#cadastro.username.includes(search);
            }
            return true;
        });
    }

    create(cadastro) {
        const cadId = randomUUID();

        this.#cadastro.set(cadId, cadastro);
    }

    update(id, cadastro) {
        this.#cadastro.set(id, cadastro);
    }

    delete(id) {
        this.#cadastro.delete(id);
    }
}