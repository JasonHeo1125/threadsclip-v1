'use client';

import { useState, useEffect, useCallback } from 'react';
import { showToast, ToastContainer } from '@/components/ui/Toast';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [users, setUsers] = useState<any[]>([]);
  const [defaultLimit, setDefaultLimit] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editLimitInput, setEditLimitInput] = useState('');

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        fetchData();
      } else {
        showToast('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
      }
    } catch (error) {
      showToast('로그인 실패. 다시 시도해주세요.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setEmailInput('');
    setPasswordInput('');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch(`/api/admin/users?page=${page}&search=${searchQuery}`);
      const userData = await userRes.json();
      if (userData.error) throw new Error(userData.error);
      setUsers(userData.data);
      setTotalPages(userData.meta.totalPages);

      const settingRes = await fetch('/api/admin/settings');
      const settingData = await settingRes.json();
      if (settingData.defaultValue) {
        setDefaultLimit(settingData.defaultValue);
      }
    } catch (error) {
      console.error(error);
      showToast('데이터를 불러오는데 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleUpdateLimit = async (userId: string, newLimit: number) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, storageLimit: newLimit }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('저장 한도가 수정되었습니다.', 'success');
        setUsers(users.map(u => u.id === userId ? { ...u, storageLimit: newLimit } : u));
        setEditingUser(null);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showToast('수정 실패', 'error');
    }
  };

  const handleUpdateDefaultLimit = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultValue: defaultLimit }),
      });
      if (res.ok) {
        showToast('기본 설정이 저장되었습니다.', 'success');
      } else {
        throw new Error('Failed');
      }
    } catch {
      showToast('설정 저장 실패', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <form onSubmit={handleLoginSubmit} className="bg-[var(--color-bg-card)] p-8 rounded-lg border border-[var(--color-border)] shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-6 text-[var(--color-text)] text-center">관리자 로그인</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">이메일</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 rounded bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">비밀번호</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2 rounded bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <button type="submit" disabled={isLoggingIn} className="w-full btn btn-primary py-2 mt-6">
            {isLoggingIn ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border)] transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border)]'}`}
            >
              사용자 관리
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border)]'}`}
            >
              시스템 설정
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름 또는 이메일 검색..."
                className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
              <button type="submit" className="btn btn-secondary px-4">검색</button>
            </form>

            <div className="overflow-x-auto bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] text-sm border-b border-[var(--color-border)]">
                    <th className="p-4 font-medium">사용자</th>
                    <th className="p-4 font-medium">이메일</th>
                    <th className="p-4 font-medium">가입일</th>
                    <th className="p-4 font-medium text-center">저장된 스레드</th>
                    <th className="p-4 font-medium text-center">저장 한도</th>
                    <th className="p-4 font-medium text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--color-bg-elevated)] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)]" />
                        )}
                        <span className="font-medium">{user.name}</span>
                      </td>
                      <td className="p-4 text-[var(--color-text-secondary)]">{user.email}</td>
                      <td className="p-4 text-sm text-[var(--color-text-muted)]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">{user._count?.savedThreads || 0}</td>
                      <td className="p-4 text-center font-mono text-[var(--color-primary)]">
                        {user.storageLimit}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setEditLimitInput(user.storageLimit.toString());
                          }}
                          className="text-sm px-3 py-1 rounded bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border)] transition-colors"
                        >
                          한도 수정
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[var(--color-text-muted)]">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded border border-[var(--color-border)] disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-3 py-1 text-[var(--color-text-muted)]">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded border border-[var(--color-border)] disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[var(--color-bg-card)] p-6 rounded-lg border border-[var(--color-border)]">
            <h2 className="text-xl font-bold mb-4">시스템 설정</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  신규 사용자 기본 저장 한도 (Free Tier)
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={defaultLimit}
                    onChange={(e) => setDefaultLimit(parseInt(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                  <button 
                    onClick={handleUpdateDefaultLimit}
                    className="btn btn-primary whitespace-nowrap"
                  >
                    설정 저장
                  </button>
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  * 이미 가입한 사용자의 한도는 변경되지 않습니다. 신규 가입자에게만 적용됩니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-bg-card)] rounded-lg p-6 w-full max-w-sm border border-[var(--color-border)] shadow-xl animate-pulseScale">
            <h3 className="text-lg font-bold mb-4">저장 한도 수정</h3>
            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
              사용자: <span className="font-semibold text-[var(--color-text)]">{editingUser.name}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">한도 (개수)</label>
              <input
                type="number"
                value={editLimitInput}
                onChange={(e) => setEditLimitInput(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[var(--color-bg-input)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded text-sm hover:bg-[var(--color-bg-elevated)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleUpdateLimit(editingUser.id, parseInt(editLimitInput))}
                className="btn btn-primary px-4 py-2 text-sm"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
