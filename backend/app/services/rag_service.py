import re
import math
from typing import List, Dict, Any
from collections import Counter

class RAGService:
    def chunk_text(self, text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
        """
        Splits text into meaningful semantic chunks respecting sentence boundaries.
        """
        if not text:
            return []
        
        # Clean text
        text = re.sub(r'\s+', ' ', text).strip()
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        chunks = []
        current_chunk = []
        current_len = 0
        
        for sentence in sentences:
            sentence_words = len(sentence.split())
            if current_len + sentence_words > chunk_size and current_chunk:
                chunks.append(" ".join(current_chunk))
                # keep overlap
                overlap_words = 0
                new_chunk = []
                for s in reversed(current_chunk):
                    s_words = len(s.split())
                    if overlap_words + s_words <= overlap:
                        new_chunk.insert(0, s)
                        overlap_words += s_words
                    else:
                        break
                current_chunk = new_chunk + [sentence]
                current_len = sum(len(s.split()) for s in current_chunk)
            else:
                current_chunk.append(sentence)
                current_len += sentence_words
                
        if current_chunk:
            chunks.append(" ".join(current_chunk))
            
        return chunks

    def _tokenize(self, text: str) -> List[str]:
        words = re.findall(r'\b[a-zA-Z0-9_\-%\$]+\b', text.lower())
        stopwords = {
            "a", "an", "the", "and", "or", "is", "are", "was", "were", "in", 
            "on", "at", "to", "for", "with", "by", "about", "as", "into", 
            "like", "through", "after", "over", "between", "out", "against",
            "during", "without", "before", "under", "around", "among", "of"
        }
        return [w for w in words if w not in stopwords]

    def _compute_cosine_similarity(self, text1: str, text2: str) -> float:
        tokens1 = self._tokenize(text1)
        tokens2 = self._tokenize(text2)
        if not tokens1 or not tokens2:
            return 0.0

        vec1 = Counter(tokens1)
        vec2 = Counter(tokens2)

        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])

        sum1 = sum([val ** 2 for val in vec1.values()])
        sum2 = sum([val ** 2 for val in vec2.values()])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)

        if not denominator:
            return 0.0
        return float(numerator) / denominator

    def retrieve_relevant_brand_knowledge(
        self,
        submission_text: str,
        facts: List[Any],
        guidelines: List[Any],
        terminologies: List[Any],
        top_k: int = 8
    ) -> List[Dict[str, Any]]:
        """
        Retrieves the top-k most relevant Brand DNA items based on cosine similarity
        and keyword matching against the submission text.
        """
        candidates = []

        # 1. Evaluate Facts
        for fact in facts:
            fact_text = f"{fact.claim_text} (Source: {fact.source_name})"
            sim = self._compute_cosine_similarity(submission_text, fact.claim_text)
            
            # Boost if specific numbers/dates/terms match
            numbers_in_fact = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', fact.claim_text))
            numbers_in_submission = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', submission_text))
            if numbers_in_fact & numbers_in_submission:
                sim += 0.25

            candidates.append({
                "type": "fact",
                "id": str(fact.id),
                "text": fact.claim_text,
                "source": fact.source_name,
                "source_ref": fact.source_url_or_ref,
                "category": fact.category,
                "score": round(sim, 4)
            })

        # 2. Evaluate Guidelines
        for g in guidelines:
            sim = self._compute_cosine_similarity(submission_text, f"{g.title} {g.content}")
            candidates.append({
                "type": "guideline",
                "id": str(g.id),
                "text": f"{g.title}: {g.content}",
                "source": f"Guideline ({g.category})",
                "rule_type": g.rule_type,
                "severity": g.severity,
                "score": round(sim, 4)
            })

        # 3. Evaluate Terminology
        for t in terminologies:
            # Direct presence in submission text
            pattern = rf'\b{re.escape(t.term)}\b'
            matched = bool(re.search(pattern, submission_text, re.IGNORECASE))
            sim = 0.95 if matched else self._compute_cosine_similarity(submission_text, t.term)
            if matched or sim > 0.3:
                candidates.append({
                    "type": "terminology",
                    "id": str(t.id),
                    "text": t.term,
                    "term_type": t.term_type,
                    "replacement": t.replacement_suggestion,
                    "explanation": t.explanation,
                    "source": f"Terminology Rule ({t.term_type})",
                    "score": round(sim, 4)
                })

        # Sort by relevance score descending
        sorted_candidates = sorted(candidates, key=lambda x: x["score"], reverse=True)
        return sorted_candidates[:top_k]

rag_service = RAGService()

