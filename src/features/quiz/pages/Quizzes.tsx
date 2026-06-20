import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../useQuizStore'
import Button from '../../../components/ui/Button'
import layout from './quizPageLayout.module.css'
import styles from './Quizzes.module.css'

const PAGE_SIZE = 8

type SortDir = 'asc' | 'desc'

export default function Quizzes() {
  const navigate = useNavigate()
  const { quizzes, deleteQuiz, loading } = useQuizStore()

  const [search, setSearch] = useState('')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  // ── Derived list ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
        ? quizzes.filter(quiz => quiz.title.toLowerCase().includes(q))
        : quizzes

    return [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === 'asc' ? diff : -diff
    })
  }, [quizzes, search, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  // Reset to page 1 when search or sort changes
  const safePage = Math.min(page, totalPages)

  const pageItems = filtered.slice(
      (safePage - 1) * PAGE_SIZE,
      safePage * PAGE_SIZE
  )

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  function toggleSort() {
    setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    setPage(1)
  }

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    if (!confirm('Delete quiz?')) return
    await deleteQuiz(String(id))
  }

  function handleEdit(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    navigate(`/app/quizzes/${id}/edit`)
  }

  function handlePlay(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    navigate(`/play/${id}`)
  }

  // ── Pagination pages array ────────────────────────────────────────────────

  function getPageNumbers(): (number | '…')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | '…')[] = [1]
    if (safePage > 3) pages.push('…')
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i)
    }
    if (safePage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
    return pages
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
      <div className={layout.page}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={layout.title}>My quizzes</h1>

          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
                className={styles.searchInput}
                type="search"
                placeholder="Search by title…"
                value={search}
                onChange={handleSearchChange}
            />
          </div>

          <button
              type="button"
              className={styles.sortBtn}
              onClick={toggleSort}
              title={sortDir === 'asc' ? 'Oldest first' : 'Newest first'}
          >
            Date
            <span className={`${styles.sortArrow} ${sortDir === 'asc' ? styles.sortArrowAsc : styles.sortArrowDesc}`}>
            ▲
          </span>
          </button>

          <Button variant="primary" onClick={() => navigate('/app/quizzes/create')}>
            + Create quiz
          </Button>
        </div>

        {/* Empty states */}
        {quizzes.length === 0 ? (
            <div className={styles.empty}>
              <p>No quizzes yet.</p>
              <Button variant="primary" onClick={() => navigate('/app/quizzes/create')}>
                Create first quiz
              </Button>
            </div>
        ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No quizzes match "{search}".</p>
            </div>
        ) : (
            <>
              {/* Scrollable table */}
              <div className={styles.tableWrap}>
                <ul className={styles.list}>
                  {pageItems.map(quiz => (
                      <li key={quiz.id}>
                        <div
                            className={styles.card}
                            onClick={() => navigate(`/app/quizzes/${quiz.id}/preview`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                navigate(`/app/quizzes/${quiz.id}/preview`)
                              }
                            }}
                        >
                          <div className={styles.cardInfo}>
                            <span className={styles.cardTitle}>{quiz.title}</span>
                            {quiz.description && (
                                <span className={styles.cardDescription}>{quiz.description}</span>
                            )}
                          </div>

                          <div className={styles.cardMeta}>
                            <span>{quiz.questions.length} q.</span>
                            <span>{quiz.difficulty}</span>
                            <span>{quiz.defaultTimeLimit}s</span>
                          </div>

                          <div className={styles.cardActions}>
                            <Button variant="primary" size="sm" onClick={e => handlePlay(e, quiz.id)}>
                              Play
                            </Button>
                            <Button size="sm" onClick={e => handleEdit(e, quiz.id)}>
                              Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={e => handleDelete(e, quiz.id)}
                                disabled={loading}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </li>
                  ))}
                </ul>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        aria-label="Previous page"
                    >
                      ←
                    </button>

                    {getPageNumbers().map((p, i) =>
                        p === '…' ? (
                            <span key={`dots-${i}`} className={styles.pageDots}>…</span>
                        ) : (
                            <button
                                key={p}
                                className={`${styles.pageBtn} ${p === safePage ? styles.pageBtnActive : ''}`}
                                onClick={() => setPage(p)}
                                aria-label={`Page ${p}`}
                                aria-current={p === safePage ? 'page' : undefined}
                            >
                              {p}
                            </button>
                        )
                    )}

                    <button
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        aria-label="Next page"
                    >
                      →
                    </button>
                  </div>
              )}
            </>
        )}

      </div>
  )
}