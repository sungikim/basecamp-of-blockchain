
$(document).ready(function() {




// 검색바 입력에 대한 기능

const termList = $('#term-list');
const terms = termList.find('.term');

$('.mobile-search').on('input', function() {
    search($(this));
});
$('.desktop-search').on('input', function() {
    search($(this));
});

function search(searchInput) {
    const searchTerm = searchInput.val().trim().toLowerCase();
    const matchingTerms = Array.from(terms).filter(term => $(term).find('h3').text().toLowerCase().includes(searchTerm));
    const dropdown = $('.search-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
    if (searchTerm.length >= 3 && matchingTerms.length > 0) {
        const dropdown = $('<div>').addClass('search-dropdown');
        const maxResults = 10;
        const totalResults = matchingTerms.length;
        const resultsToShow = matchingTerms.slice(0, maxResults);
        resultsToShow.forEach(matchingTerm => {
            const dropdownItemWrapper = $('<div>').addClass('search-dropdown-item-wrapper');
            const dropdownItem = $('<div>').addClass('search-dropdown-item');
            dropdownItem.text($(matchingTerm).find('h3').text());
            dropdownItem.on('click', function() {
                const targetId = $(matchingTerm).attr('term');
                moveToTerm(targetId);
                // 가변형 대응
                if ($(window).width() < 1000) {
                    $('.header-bottom .lnb-search .lnb-item-container .search-dropdown').remove();
                }
            });
            
            dropdownItemWrapper.append(dropdownItem);
            dropdown.append(dropdownItemWrapper);
        });
        if (totalResults > maxResults) {
            const remainingResults = totalResults - maxResults;
            const remainingText = $('<div>').addClass('search-dropdown-item more');
            remainingText.text(`+ ${remainingResults} more results`);
            dropdown.append(remainingText);
        }
        $(".lnb-item-container").prepend(dropdown);
    } else {
        $('.search-dropdown').remove();
    }
    // 검색바 엔터키 액션 방지
    $('form').submit(function(event) {
        event.preventDefault();
    });

    // 검색바의 clear 버튼 클릭 시, 검색어 초기화
    $('.clear-search').on('click', function() {
        searchInput.val('');
        $('.search-dropdown').remove();
        $('.clear-search').hide();
    });

    // 검색바 입력 시, clear 버튼 표시
    searchInput.on('input', function() {
        if (searchInput.val().length > 0) {
            $('.clear-search').css('display', 'inline-block').show();
        } else {
            $('.clear-search').hide();
        }
    });

}












// 스크롤 시, header 상단에 고정 및 스타일 변경
if ($(window).scrollTop() >= 150) {
    $('#header').addClass('scroll');
    $('.header-top').addClass('scroll');
    $('#header h1').addClass('scroll'); 
    $('.header-top-title p').addClass('scroll');  
}

window.addEventListener('scroll', function() {
    $(window).scroll(function() {
        if ($(window).scrollTop() >= 80) {
            $('.header-top-title p').addClass('scroll');
        }
        else {
            $('.header-top-title p').removeClass('scroll');
        }
    });
    $(window).scroll(function() {
        if ($(window).scrollTop() >= 150) {
            $('#header').addClass('scroll');
            $('.header-top').addClass('scroll');
            $('#header h1').addClass('scroll');   
        }
        else {
            $('#header').removeClass('scroll');
            $('.header-top').removeClass('scroll');
            $('#header h1').removeClass('scroll');
        }
    });
});

// 언어 변경 기능
$('#langBtn').click(function(event) {
    event.stopPropagation();
    $('#langDropdown').toggle();
});
$(window).click(function(event) {
    if ($('#langDropdown').is(':visible') && !$(event.target).is('#langBtn') && !$(event.target).is('#langDropdown')) {
        $('#langDropdown').hide();
    }
});

// header의 타이틀을 클릭하면, 페이지 최상단으로 이동
$('#header h1').click(function() {
    $('html, body').scrollTop(0);
});

// header의 알파벳 클릭 시, 해당 위치로 이동
$('.header-bottom-group-letter a').on('click', function(event) {
    const anchor = $(this).attr('letter');
    event.preventDefault();
    const target = document.getElementById(anchor);
    const targetPosition = $(target).offset().top - 90;
    window.scrollTo({
        top: targetPosition,
        behavior: 'instant'
    });
});



})



// 연관 용어 클릭 시, 팝업 띄우기
function showPopup(term) {
    addHistory(term);
    const termDiv = $(`[term="${term}"]`);
    const termContent = termDiv.html();
    let popup = $('.popup');
    if (popup.length === 0) {
        popup = `
            <div class="popup">
                <div class="popup-content">
                    ${termContent}
                </div>
            </div>
            <div class="popup-close">
                <div class="popup-close-btn">Close</div>
            </div>
        `;
        $('body').append(popup);
    } else {
        // const popupContent = `
        //     ${Math.random() < 0.1 ? "<div class='popup-content support'><a href='https://ko-fi.com/lazytim' target='_blank'>Is this feature helpful to you? ☕️ Buy a Coffee for lazyTim</a></div>" : ""}
        //     <div class="popup-content">
        //         ${termContent}
        //     </div>
        // `;
        // popup.append(popupContent);
        popup.animate({ scrollTop: popup.prop("scrollHeight") }, 300);
        popup.css('justify-content', 'flex-start');
    }
    $('body').css('overflow', 'hidden');
    $('.popup .close').click(function() {
        $('.popup').remove();
        $('.popup-close').hide();
        $('body').css('overflow', 'auto');
    });
    $('.popup-close').click(function() {
        $('.popup').remove();
        $('.popup-close').hide();
        $('body').css('overflow', 'auto');
    });
    $('.popup').click(function(event) {
        if (!$(event.target).closest('.popup-content').length) {
            $('.popup').remove();
            $('.popup-close').hide();
            $('body').css('overflow', 'auto');
        }
    });
}


// lnb 히스토리에 추가
function addHistory(term, isHistory) {
    if(isHistory == undefined) {
        dic = $('#term-list').find(`[term="${term}"]`).find('h3').text()
        $('.lnb-history').prepend(`<div class='history-item'><p onclick="moveToTerm('${term}','h')">${dic}</p></div>`);
    }
}

// 단어 클릭 시, 우측 컨텐츠 페이지를 해당 위치로 이동시키기 (검색, 히스토리에서 동작함)
function moveToTerm(term,isHistory) {
    addHistory(term,isHistory);
    const target = $('[term="' + term + '"]');
    const targetPosition = $(target).offset().top - 90;
    window.scrollTo({
        top: targetPosition,
        behavior: 'instant'
    });
}
