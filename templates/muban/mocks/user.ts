/* eslint-disable @typescript-eslint/naming-convention */
import type { RequestConfig } from '@mediamonks/monck';
import faker from 'faker';
import { imageTestDefaultMockData } from '../src/components/image-test/ImageTest.mocks';

export default {
  'GET /user/info': (_, response) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName(firstName, lastName);

    response.send({
      id: faker.random.uuid(),
      userName: username,
      email: faker.internet.email(firstName, lastName),
      firstName,
      lastName,
    });
  },

  'POST /user/login': (request, response) => {
    const { userName, password } = request.body;
    if (userName === 'john' && password === 'password') {
      response.send({
        success: true,
      });
    } else {
      response.send({
        success: false,
      });
    }
  },
  'GET /mock-test': (_, response) => {
    response.send({
      ...imageTestDefaultMockData,
      test: 'hmr',
    });
  },
} as RequestConfig;
