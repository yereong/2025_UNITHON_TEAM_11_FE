'use client';

import RecipeTitle from '../../../components/detail/RecipeTitle';
import RecipeSortSelector from '../../../components/detail/RecipeSortSelector';
import RecipeGridList from '@/components/detail/RecipeGridList';
import Header from '@/components/header/Header';
import DefaultBody from '@/components/defaultBody';
import { useUser } from '@/context/UserContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { GetRecipeList } from '@/api/recipe/getRecipelist';

export default function RecipeListPage() {
  const { userInfo } = useUser();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchRecipes = async (pageNumber: number) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await GetRecipeList(pageNumber);

      // ✅ 이미 불러온 id와 중복 제거
      setRecipes(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const filtered = res.filter(item => !existingIds.has(item.id));
        return [...prev, ...filtered];
      });

      if (res.length < 6) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('레시피 데이터 로딩 실패:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRecipes(0);
  }, []);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isFetching) {
        fetchRecipes(page);
      }
    },
    [hasMore, isFetching, page]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0.5,
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleIntersect]);

  return (
    <>
      <Header>
        <Header.BackButton />
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex flex-col">
          <main className="flex flex-col items-start mt-[24px] px-4">
            <div className="px-5 text-[22px] font-semibold leading-[30px] tracking-[-0.03em] text-[#222] mb-8">
              <span>{userInfo.nickname || '고객'}</span>님께
              <span className="text-[#4BE42C]"> 최근 올라온 </span>
              <div>레시피를 알려드려요!</div>
            </div>
            <RecipeSortSelector />
            <RecipeGridList recipes={recipes} />
            {hasMore && <div ref={observerRef} className="h-10" />}
          </main>
        </div>
      </DefaultBody>
    </>
  );
}
