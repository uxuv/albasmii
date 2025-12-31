import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const containerRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  const isArabic = (text) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  };

  const getTextContent = (content) => {
    if (typeof content === 'string') {
      return content;
    }
    return '';
  };

  const textContent = getTextContent(text);
  const isJSXContent = typeof text !== 'string';
  const lines = textContent.split('\n').filter(line => line.trim() !== '');

  useGSAP(
    () => {
      if (!containerRef.current || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const container = containerRef.current;
      const lineElements = container.querySelectorAll('.split-line-wrapper');

      if (lineElements.length === 0) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const splitInstances = [];
      let allTargets = [];

      lineElements.forEach((el) => {
        const lineText = el.textContent;
        const actualSplitType = isArabic(lineText) && splitType.includes('chars') 
          ? 'words' 
          : splitType;

        if (el._rbsplitInstance) {
          try {
            el._rbsplitInstance.revert();
          } catch (_) {}
          el._rbsplitInstance = null;
        }

        const splitInstance = new GSAPSplitText(el, {
          type: actualSplitType,
          smartWrap: true,
          autoSplit: actualSplitType === 'lines',
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
          reduceWhiteSpace: false
        });

        let targets;
        if (actualSplitType.includes('chars') && splitInstance.chars?.length) {
          targets = splitInstance.chars;
        } else if (actualSplitType.includes('words') && splitInstance.words?.length) {
          targets = splitInstance.words;
        } else if (actualSplitType.includes('lines') && splitInstance.lines?.length) {
          targets = splitInstance.lines;
        } else {
          targets = splitInstance.chars || splitInstance.words || splitInstance.lines;
        }

        if (targets && targets.length > 0) {
          allTargets.push(...targets);
        }

        el._rbsplitInstance = splitInstance;
        splitInstances.push(splitInstance);
      });

      if (allTargets.length > 0) {
        gsap.fromTo(
          allTargets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: container,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              onCompleteRef.current?.();
            },
            willChange: 'transform, opacity',
            force3D: true
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === container) st.kill();
        });
        splitInstances.forEach(instance => {
          try {
            instance.revert();
          } catch (_) {}
        });
        lineElements.forEach(el => {
          el._rbsplitInstance = null;
        });
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: containerRef
    }
  );

  const renderTag = () => {
    const hasArabic = isArabic(textContent);
    const containerStyle = {
      textAlign,
      width: '100%',
      ...(hasArabic && { direction: 'rtl' })
    };

    const lineStyle = {
      display: 'inline',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };

    const classes = `split-parent ${className}`;
    const containerProps = {
      ref: containerRef,
      style: containerStyle,
      className: classes,
      ...(hasArabic && { lang: 'ar' })
    };

    const content = isJSXContent ? (
      <span className="split-line-wrapper" style={lineStyle}>
        {text}
      </span>
    ) : (
      lines.map((line, index) => (
        <span key={index} className="split-line-wrapper" style={lineStyle}>
          {line}
        </span>
      ))
    );

    switch (tag) {
      case 'h1':
        return <h1 {...containerProps}>{content}</h1>;
      case 'h2':
        return <h2 {...containerProps}>{content}</h2>;
      case 'h3':
        return <h3 {...containerProps}>{content}</h3>;
      case 'h4':
        return <h4 {...containerProps}>{content}</h4>;
      case 'h5':
        return <h5 {...containerProps}>{content}</h5>;
      case 'h6':
        return <h6 {...containerProps}>{content}</h6>;
      default:
        return <p {...containerProps}>{content}</p>;
    }
  };

  return renderTag();
};

export default SplitText;