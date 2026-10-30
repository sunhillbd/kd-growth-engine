import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ContentItem, DestinationId } from '../../types';
import { PostDetailDrawer } from '../../components/content/PostDetailDrawer';

export const PostsPage: React.FC = () => {
  const { content } = useStore();
  const [selectedPost, setSelectedPost] = useState<ContentItem | null>(null);

  // All posts with metrics or scheduled
  const postsList = content.filter(c => c.status === 'Published' || c.status === 'Scheduled');

  const getDestinationBadge = (destId: DestinationId) => {
    switch (destId) {
      case 'linkedin_personal': return 'LI';
      case 'linkedin_company': return 'LIC';
      case 'facebook_page': return 'FB';
      case 'x_profile': return 'X';
      case 'website_blog': return 'WEB';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Post Performance & Destination Attribution</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Engagement metrics and downstream pipeline deal values attributed to multi-destination content.
          </p>
        </div>
        <div className="text-xs font-mono text-gray-500">
          Showing {postsList.length} published & scheduled posts
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">Post Excerpt</th>
              <th className="py-2.5 px-4 font-normal">Destinations</th>
              <th className="py-2.5 px-4 font-normal text-center">Status</th>
              <th className="py-2.5 px-4 font-normal">Scheduled / Published Date</th>
              <th className="py-2.5 px-4 font-normal text-right">Impressions</th>
              <th className="py-2.5 px-4 font-normal text-right">Engagements</th>
              <th className="py-2.5 px-4 font-normal text-right">Replies / DMs</th>
              <th className="py-2.5 px-4 font-normal text-right">Linked Deals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {postsList.map(post => {
              const dests = post.selectedDestinations || ['linkedin_personal'];

              return (
                <tr
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer h-12"
                >
                  <td className="py-2 px-4 font-semibold text-gray-900 max-w-xs truncate" title={post.topic}>
                    {post.topic}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {dests.map(d => (
                        <span
                          key={d}
                          className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded"
                        >
                          {getDestinationBadge(d)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                      post.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                    {post.publishedDate || post.scheduledDay || 'Upcoming'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                    {post.impressions?.toLocaleString() ?? '—'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                    {post.engagements?.toLocaleString() ?? '—'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-gray-900">
                    {post.repliesOrDms ?? '—'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">
                    {post.linkedDeals ? `$${post.linkedDeals.toLocaleString()}` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Post Detail Drawer */}
      <PostDetailDrawer
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};
