// Google Analytics event tracking utilities

// Declare gtag on window
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Track CTA button clicks
export const trackCTAClick = (
  ctaName: string,
  ctaLocation: string,
  ctaType: 'email' | 'link' | 'button' = 'button'
) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_type: ctaType,
  });
};

// Track page section views (for scroll tracking)
export const trackSectionView = (sectionName: string, pageName: string) => {
  trackEvent('section_view', {
    section_name: sectionName,
    page_name: pageName,
  });
};

// Track form interactions
export const trackFormStart = (formName: string) => {
  trackEvent('form_start', {
    form_name: formName,
  });
};

export const trackFormSubmit = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
  });
};

// Track outbound links
export const trackOutboundLink = (url: string, linkText: string) => {
  trackEvent('outbound_link', {
    link_url: url,
    link_text: linkText,
  });
};

// Track email link clicks (these are your conversions!)
export const trackEmailClick = (
  emailSubject: string,
  buttonText: string,
  pageLocation: string
) => {
  trackEvent('email_click', {
    email_subject: emailSubject,
    button_text: buttonText,
    page_location: pageLocation,
  });

  // Also track as a conversion event
  trackEvent('generate_lead', {
    lead_source: pageLocation,
    lead_type: emailSubject,
  });
};

// Track training guide interactions
export const trackTrainingGuideSection = (sectionId: string) => {
  trackEvent('training_guide_section', {
    section_id: sectionId,
  });
};

// Track scroll depth
export const trackScrollDepth = (depth: number, pageName: string) => {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
    page_name: pageName,
  });
};

// Track time on page (call on unmount)
export const trackTimeOnPage = (pageName: string, timeSeconds: number) => {
  trackEvent('time_on_page', {
    page_name: pageName,
    time_seconds: timeSeconds,
  });
};

// Track capability page views with more detail
export const trackCapabilityView = (capabilityName: string) => {
  trackEvent('capability_view', {
    capability_name: capabilityName,
  });
};

// Track navigation clicks
export const trackNavClick = (destination: string, fromPage: string) => {
  trackEvent('nav_click', {
    destination: destination,
    from_page: fromPage,
  });
};
