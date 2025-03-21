import type { Prisma, WorkspaceUserRole } from '@prisma/client';

import { WorkspaceMemberStatus, WorkspaceRole } from '../../models';
import { Mocker } from './factory';

export type MockWorkspaceUserInput =
  Prisma.WorkspaceUserRoleUncheckedCreateInput & {
    type?: WorkspaceRole;
    status?: WorkspaceMemberStatus;
  };

export class MockWorkspaceUser extends Mocker<
  MockWorkspaceUserInput,
  WorkspaceUserRole
> {
  override async create(input: MockWorkspaceUserInput) {
    input.type = input.type ?? WorkspaceRole.Collaborator;
    input.status = input.status ?? WorkspaceMemberStatus.Accepted;
    return await this.db.workspaceUserRole.create({
      data: input,
    });
  }
}
