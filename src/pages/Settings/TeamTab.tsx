import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole, TeamMember } from '../../types';
import { UserPlus, Trash2, RotateCw, AlertTriangle, Check, Shield } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const TeamTab: React.FC = () => {
  const { teamMembers, inviteTeamMember, resendInvite, revokeInvite, removeTeamMember, currentUser } = useStore();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Editor');

  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteTeamMember(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setInviteRole('Editor');
    setInviteModalOpen(false);
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'Owner': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Editor': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Approver': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Viewer': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Invite Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
            Workspace Team Members ({teamMembers.length})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage who has access to Kinetik Growth Engine and their permission tiers.
          </p>
        </div>

        {currentUser.role === 'Owner' && (
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="text-xs font-medium py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Invite member</span>
          </button>
        )}
      </div>

      {/* Team Members Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">Member</th>
              <th className="py-2.5 px-4 font-normal">Email</th>
              <th className="py-2.5 px-4 font-normal">Role</th>
              <th className="py-2.5 px-4 font-normal">Status</th>
              <th className="py-2.5 px-4 font-normal">Last Active</th>
              <th className="py-2.5 px-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teamMembers.map(member => (
              <tr key={member.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-semibold text-[11px] flex items-center justify-center">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{member.name}</span>
                    {member.id === currentUser.id && (
                      <span className="text-[10px] text-gray-400 font-normal">(You)</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                  {member.email}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${getRoleBadgeClass(member.role)}`}>
                    {member.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                    member.status === 'Active' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    {member.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-[11px]">
                  {member.lastActive}
                </td>
                <td className="py-3 px-4 text-right">
                  {currentUser.role === 'Owner' && member.id !== currentUser.id && (
                    <div className="flex items-center justify-end gap-2">
                      {member.status === 'Invited' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => resendInvite(member.id)}
                            className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            title="Resend invitation email"
                          >
                            <RotateCw className="w-3 h-3" strokeWidth={1.5} />
                            <span>Resend</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => revokeInvite(member.id)}
                            className="text-[11px] text-rose-600 hover:text-rose-800"
                            title="Revoke invitation"
                          >
                            Revoke
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRemoveTarget(member)}
                          className="text-[11px] text-gray-400 hover:text-rose-600 flex items-center gap-1"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Reference Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            Role Permissions Matrix
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-100 rounded">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <th className="py-2 px-3 font-medium">Role</th>
                <th className="py-2 px-3 font-medium">Draft & Edit Content / Brain</th>
                <th className="py-2 px-3 font-medium">Approve Leads & Social Posts</th>
                <th className="py-2 px-3 font-medium">Access Tokens & API Spend Caps</th>
                <th className="py-2 px-3 font-medium">Manage Team & Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px]">
              <tr>
                <td className="py-2 px-3 font-semibold text-purple-800">Owner</td>
                <td className="py-2 px-3 text-emerald-700">Full access</td>
                <td className="py-2 px-3 text-emerald-700">Full access</td>
                <td className="py-2 px-3 text-emerald-700">Full access</td>
                <td className="py-2 px-3 text-emerald-700">Full access</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-blue-800">Editor</td>
                <td className="py-2 px-3 text-emerald-700">Full access</td>
                <td className="py-2 px-3 text-gray-400">View only (cannot approve)</td>
                <td className="py-2 px-3 text-gray-400">Hidden / Locked</td>
                <td className="py-2 px-3 text-gray-400">No</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-emerald-800">Approver</td>
                <td className="py-2 px-3 text-gray-600">View only</td>
                <td className="py-2 px-3 text-emerald-700">Full approval authority</td>
                <td className="py-2 px-3 text-gray-400">Hidden / Locked</td>
                <td className="py-2 px-3 text-gray-400">No</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-gray-800">Viewer</td>
                <td className="py-2 px-3 text-gray-500">Read only</td>
                <td className="py-2 px-3 text-gray-400">No (Approve buttons disabled)</td>
                <td className="py-2 px-3 text-gray-400">Hidden / Locked</td>
                <td className="py-2 px-3 text-gray-400">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Team Member"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="colleague@kinetikdynamics.com"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Permission Role
            </label>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as UserRole)}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Editor">Editor (Can draft and edit brain & content)</option>
              <option value="Approver">Approver (Can approve leads & social posts)</option>
              <option value="Viewer">Viewer (Read-only access)</option>
              <option value="Owner">Owner (Full studio administrator)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] font-medium"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Remove Member Confirmation Modal */}
      {removeTarget && (
        <Modal
          isOpen={!!removeTarget}
          onClose={() => setRemoveTarget(null)}
          title="Remove Team Member"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-700">
              Are you sure you want to remove <span className="font-semibold text-gray-900">{removeTarget.name}</span> ({removeTarget.email})? 
              They will lose access to Kinetik Growth Engine immediately.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRemoveTarget(null)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[6px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  removeTeamMember(removeTarget.id);
                  setRemoveTarget(null);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[6px] font-medium"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
