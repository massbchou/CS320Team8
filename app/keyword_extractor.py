import sys
import json
import yake
kw_extractor = yake.KeywordExtractor(
  lan = "en",
  n = 3,
  dedupLim = 0.25,
  dedupFunc = 'seqm',
  windowsSize = 1,
  top = 5
)
keywords = kw_extractor.extract_keywords(sys.argv[1])
output = []
for obj in keywords:
    output.append(obj[0])
print(json.dumps(output))
sys.stdout.flush()